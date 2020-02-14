import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loader
} from './styles';

export default class User extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: true,
    refreshing: false,
  };

  async componentDidMount(){
    this.loadMoreRepos();
  }

  loadMoreRepos = async (page = 1) => {
    const {stars} = this.state;
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`users/${user.login}/starred`, {
      params: {page},
    });

    this.setState({
      stars: page > 1 ? [...stars, ...response.data] : response.data,
      page,
      loading: false,
      refreshing: false,
    });
  }

  addPage = () => {
    const {page} = this.state;

    const nextPage = page + 1;

    this.loadMoreRepos(nextPage);
  }

  refreshList = () => {
    this.setState({refreshing: true});

    this.loadMoreRepos(1);
  }

  handleNavigate = repository => {
    const {navigation} = this.props;

    console.tron.log('navigate', repository);

    navigation.navigate('Repo', { repository });
  }

  render(){
    const {navigation} = this.props;
    const {stars, loading, refreshing} = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
            <Avatar source={{ uri: user.avatar }}/>
            <Name>{user.name}</Name>
            <Bio>{user.bio}</Bio>
        </Header>
        {loading ?
        (
        <Loader/>
        ) : (
        <Stars
          data={stars}
          onEndReachedThreshold={0.2}
          onEndReached={this.addPage}
          onRefresh={this.refreshList}
          refreshing={refreshing}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred onPress={ () => this.handleNavigate(item) }>
              <OwnerAvatar source={{uri: item.owner.avatar_url}}/>
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
          />
        )}

      </Container>
    );
  }
}
