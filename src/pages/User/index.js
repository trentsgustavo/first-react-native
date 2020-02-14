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
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: true,
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

    console.tron.log(stars);

    this.setState({
      stars: page > 1 ? [...stars, ...response.data] : response.data,
      page,
      loading: false
    });
  }

  addPage = () => {
    const {page} = this.state;

    const nextPage = page + 1;

    this.loadMoreRepos(nextPage);
  }

  render(){
    const {navigation} = this.props;
    const {stars, loading} = this.state;

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
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
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
